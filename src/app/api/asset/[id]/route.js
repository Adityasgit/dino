import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// 🔹 GET SINGLE ASSET
export async function GET(
    req,
    { params }
) {
    try {
        const asset = await prisma.assetType.findUnique({
            where: { id: params.id }
        })

        if (!asset) {
            return NextResponse.json(
                { error: "Asset not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(asset)
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// UPDATE ASSET
export async function PUT(
    req,
    { params }
) {
    try {
        const { code, name } = await req.json()

        const updated = await prisma.assetType.update({
            where: { id: params.id },
            data: {
                code: code?.toUpperCase(),
                name
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    }
}

// DELETE ASSET
export async function DELETE(
    req,
    { params }
) {
    try {
        await prisma.assetType.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: "Deleted successfully" })
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    }
}