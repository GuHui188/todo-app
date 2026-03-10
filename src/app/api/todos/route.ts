import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

// 获取所有待办
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(todos)
}

// 新增待办
export async function POST(request: Request) {
  const { text } = await request.json()
  const todo = await prisma.todo.create({ data: { text } })
  return NextResponse.json(todo)
}

// 更新状态
export async function PUT(request: Request) {
  const { id, completed } = await request.json()
  const todo = await prisma.todo.update({
    where: { id },
    data: { completed: !completed }
  })
  return NextResponse.json(todo)
}

// 删除待办
export async function DELETE(request: Request) {
  const { id } = await request.json()
  await prisma.todo.delete({ where: { id } })
  return NextResponse.json({ success: true })
}