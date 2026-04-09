<?php

namespace App\Services;

use App\Models\OtpVerification;
use Carbon\Carbon;

class OtpService
{
    private const OTP_EXPIRY_MINUTES = 5;
    private const OTP_THROTTLE_SECONDS = 60;
    private const VERIFICATION_VALID_MINUTES = 30;

    /**
     * Generate and store an OTP for the given phone number.
     *
     * @return array{otp: string, expires_at: Carbon}
     */
    public function sendOtp(string $phone): array
    {
        $this->invalidatePreviousOtps($phone);

        $otp = $this->generateOtp();
        $expiresAt = Carbon::now()->addMinutes(self::OTP_EXPIRY_MINUTES);

        OtpVerification::create([
            'phone' => $phone,
            'otp' => $otp,
            'expires_at' => $expiresAt,
        ]);

        // TODO: Integrate real SMS gateway (e.g., Twilio, MSG91) here
        // SmsGateway::send($phone, "Your AgroVenture OTP is: {$otp}");

        return [
            'otp' => $otp,
            'expires_at' => $expiresAt,
        ];
    }

    /**
     * Verify the OTP for the given phone number.
     */
    public function verifyOtp(string $phone, string $otp): bool
    {
        $record = OtpVerification::where('phone', $phone)
            ->where('otp', $otp)
            ->whereNull('verified_at')
            ->where('expires_at', '>', Carbon::now())
            ->latest()
            ->first();

        if (!$record) {
            return false;
        }

        $record->update(['verified_at' => Carbon::now()]);

        return true;
    }

    /**
     * Check if a phone number has been recently verified via OTP.
     */
    public function isPhoneVerified(string $phone): bool
    {
        return OtpVerification::where('phone', $phone)
            ->whereNotNull('verified_at')
            // ->where('verified_at', '>', Carbon::now()->subMinutes(self::VERIFICATION_VALID_MINUTES))
            ->exists();
    }

    /**
     * Check if OTP sending is throttled for the given phone number.
     */
    public function isThrottled(string $phone): bool
    {
        return OtpVerification::where('phone', $phone)
            ->where('created_at', '>', Carbon::now()->subSeconds(self::OTP_THROTTLE_SECONDS))
            ->exists();
    }

    /**
     * Generate an OTP code.
     * Currently returns a static OTP for development. Replace with random generation for production.
     */
    private function generateOtp(): string
    {
        // Static OTP for development — replace with the line below for production:
        // return str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        return '1234';
    }

    /**
     * Invalidate all previous unverified OTPs for the phone number.
     */
    private function invalidatePreviousOtps(string $phone): void
    {
        OtpVerification::where('phone', $phone)
            ->whereNull('verified_at')
            ->update(['expires_at' => Carbon::now()]);
    }
}
