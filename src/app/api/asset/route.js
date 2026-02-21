import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET ALL ASSETS
export async function GET() {
  try {
    const assets = await prisma.assetType.findMany({
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json(assets)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

//  CREATE ASSET
export async function POST(req) {
  try {
    const { code, name } = await req.json()

    if (!code || !name) {
      return NextResponse.json(
        { error: "code and name required" },
        { status: 400 }
      )
    }

    const asset = await prisma.assetType.create({
      data: {
        code: code.toUpperCase(),
        name
      }
    })

    return NextResponse.json(asset)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}