import { NextResponse } from "next/server"
import db from "@repo/db/client";

export const dynamic = "force-dynamic";

export const GET = async () => {
    await db.user.create({
        data: {
            email: "asd",
            name: "adsads",
            password: "hashed_password",
            number: "1234567890"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}