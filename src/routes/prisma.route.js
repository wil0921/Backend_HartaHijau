import prisma from "@/libs/prisma"

export async function POST(request) {
    const { username, phoneNumber, hashPassword } = await request.json()
    const data = { username, phoneNumber, hashPassword }

    const createCollection = await prisma.collection.create({ data })
    
    if (!createCollection) return Response.json({ status: 500, isCreated: false })
    else return Response.json({ status: 200, isCreated: true })
}