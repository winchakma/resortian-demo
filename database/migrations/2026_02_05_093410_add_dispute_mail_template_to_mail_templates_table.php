<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  public function up(): void
  {
    $body = '
    <p>Dear {customer_name},</p>

    <p>
      We regret to inform you that your refund request has been
      <strong>rejected</strong> after review.
    </p>

    <p>
      <strong>Booking Reference:</strong> {booking_no}
    </p>

    <p>
      <strong>Reason for Rejection:</strong><br>
      {dispute_reason}
    </p>

    <p>
      If you believe this decision requires further review, our team will
      carefully reassess your case. You can track the latest status or submit
      additional information using the link below:
    </p>

    <p>
      <a href="{dispute_link}">{dispute_link}</a>
    </p>

    <p>
      Thank you for your understanding and cooperation.
    </p>

    <p>
      Best regards,<br>
      {website_title}
    </p>
  ';

    DB::table('mail_templates')->updateOrInsert(
      ['mail_type' => 'refund_reject_by_vendor'],
      [
        'mail_subject' => 'Refund Request Update',
        'mail_body'    => $body,
      ]
    );
  }


  public function down(): void
  {
    DB::table('mail_templates')
      ->where('mail_type', 'refund_reject_by_vendor')
      ->delete();
  }
};
