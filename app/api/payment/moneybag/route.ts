import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { order_id, order_amount, customer, success_url, cancel_url, fail_url } =
      await req.json();

    const response = await fetch(
      `${process.env.NEXT_MONEYBAG_PAYMENT_URL}/payments/checkout`,
      {
        method: "POST",
        headers: {
          "X-Merchant-API-Key": process.env.NEXT_MONEYBAG_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id,
          order_amount,
          order_description: `Resortian advance payment for booking ${order_id}`,
          currency: "BDT",
          success_url,
          cancel_url,
          fail_url,
          customer,
        }),
      },
    );

    const data = await response.json();
    console.log("[moneybag] status:", response.status, "body:", JSON.stringify(data));

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { error: data.message ?? data.error ?? "Payment initiation failed", detail: data },
        { status: response.status || 400 },
      );
    }

    return NextResponse.json({ checkout_url: data.data.checkout_url });
  } catch (err) {
    console.error("[moneybag] fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
