<?php
// Contact form handler for Hostinger. Receives the /contact/ form and emails
// it to Parul. Nothing is stored on the server apart from a short-lived
// per-visitor counter used to slow down spam.
//
// With JavaScript the form asks for JSON ({"ok": true|false}); without it the
// visitor is redirected to the thank-you page, or shown a short error page.

declare(strict_types=1);

// ---- Settings ---------------------------------------------------------------
const MAIL_TO      = 'soni.87.parul@gmail.com';
// Must be an address on the site's own domain, or Hostinger refuses to send.
// Create this mailbox in hPanel → Emails (it never needs to be read).
const MAIL_FROM    = 'website@parulsonimanvati.com';
const MAIL_FROM_NAME = 'parulsonimanvati.com';
const SUBJECT_PREFIX = 'Website enquiry';
const THANK_YOU_URL  = '/contact/thank-you/';
const MAX_PER_HOUR   = 5;

const REASONS = [
    'leadership'     => 'Leadership / Executive Opportunity',
    'transformation' => 'Business Transformation / Advisory',
    'fractional'     => 'Fractional CXO / Startup Growth',
    'speaking'       => 'Speaking / Panel / Event Invitation',
    'collaboration'  => 'Investor / Board / Policy Collaboration',
    'networking'     => 'Networking / General Conversation',
    'other'          => 'Something Else',
];
// -----------------------------------------------------------------------------

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(bool $ok, int $status, string $error = ''): void
{
    global $wantsJson;
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    } elseif ($ok) {
        header('Location: ' . THANK_YOU_URL, true, 303);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
           . '<title>Message not sent</title>'
           . '<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;line-height:1.5">'
           . '<h1>Sorry, your message didn\'t go through.</h1>'
           . '<p>' . htmlspecialchars($error) . '</p>'
           . '<p><a href="/contact/" onclick="history.back();return false;">← Go back to the form</a></p>';
    }
    exit;
}

// Encoded display name for a From/Reply-To header, safe for any characters.
function header_name(string $name): string
{
    return '=?UTF-8?B?' . base64_encode($name) . '?=';
}

// Single line of text: no control characters or line breaks.
function clean_line(string $value, int $max): string
{
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    return mb_substr(trim($value), 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 405, 'Please use the contact form.');
}

// Only accept posts sent from this site's own pages.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$ownHost = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST)) !== $ownHost) {
    respond(false, 403, 'Please use the contact form on this site.');
}

// Honeypot: real visitors never see this field. Pretend it worked so bots move on.
if (trim((string) ($_POST['bot-field'] ?? '')) !== '') {
    respond(true, 200);
}

$reason   = (string) ($_POST['reason'] ?? '');
$name     = clean_line((string) ($_POST['name'] ?? ''), 120);
$email    = clean_line((string) ($_POST['email'] ?? ''), 254);
$linkedin = clean_line((string) ($_POST['linkedin'] ?? ''), 300);
$topic    = clean_line((string) ($_POST['topic'] ?? ''), 80);
$message  = trim(str_replace("\r\n", "\n", (string) ($_POST['message'] ?? '')));
$consent  = ($_POST['consent'] ?? '') === 'yes';

if (!isset(REASONS[$reason])) {
    respond(false, 422, 'Please choose what you\'d like to connect about.');
}
if ($name === '') {
    respond(false, 422, 'Please enter your name.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 422, 'Please enter a valid email address.');
}
if ($linkedin !== '' && !preg_match('#^https?://[^\s.]+\.\S+$#i', $linkedin)) {
    respond(false, 422, 'Please enter a full LinkedIn address starting with https://, or leave it blank.');
}
if (mb_strlen($message) < 10 || mb_strlen($message) > 2000) {
    respond(false, 422, 'Please add a short message (10 to 2,000 characters).');
}
if (!$consent) {
    respond(false, 422, 'Please tick the consent box so I can respond.');
}

// Simple rate limit: at most MAX_PER_HOUR messages per visitor per hour.
// Kept in the system temp folder (not in public_html) and keyed by a hash,
// so no IP address is stored in readable form.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$counterFile = sys_get_temp_dir() . '/psm-contact-' . hash('sha256', $ip . __FILE__);
$recent = [];
if (is_readable($counterFile)) {
    $recent = array_filter(
        array_map('intval', explode(',', (string) file_get_contents($counterFile))),
        fn ($t) => $t > time() - 3600
    );
}
if (count($recent) >= MAX_PER_HOUR) {
    respond(false, 429, 'Too many messages in a short time. Please try again later, or reach me on LinkedIn.');
}

// Build the email.
$reasonLabel = REASONS[$reason];
$subject = SUBJECT_PREFIX . ': ' . $reasonLabel . ' from ' . $name;

$lines = [
    'New enquiry from the contact form on parulsonimanvati.com',
    '',
    'Reason:    ' . $reasonLabel,
    'Name:      ' . $name,
    'Email:     ' . $email,
    'LinkedIn:  ' . ($linkedin !== '' ? $linkedin : '(not given)'),
];
if ($topic !== '') {
    $lines[] = 'Came from: ' . $topic;
}
$lines[] = 'Consent:   Agreed to details being used to respond';
$lines[] = 'Sent:      ' . gmdate('j M Y, H:i') . ' UTC';
$lines[] = '';
$lines[] = 'Message:';
$lines[] = $message;
$lines[] = '';
$lines[] = '--';
$lines[] = 'Reply to this email to answer ' . $name . ' directly.';
$body = implode("\r\n", $lines);

$headers = [
    'From: ' . header_name(MAIL_FROM_NAME) . ' <' . MAIL_FROM . '>',
    'Reply-To: ' . header_name($name) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: parulsonimanvati.com contact form',
];

$sent = mail(
    MAIL_TO,
    mb_encode_mimeheader($subject, 'UTF-8'),
    $body,
    implode("\r\n", $headers),
    '-f' . MAIL_FROM
);

if (!$sent) {
    error_log('Contact form: mail() failed for an enquiry from ' . $email);
    respond(false, 502, 'The message could not be sent just now. Please try again in a few minutes, or reach me on LinkedIn.');
}

$recent[] = time();
@file_put_contents($counterFile, implode(',', $recent), LOCK_EX);

respond(true, 200);
