import { NextResponse } from 'next/server';

// 临时注释掉 Prisma 相关代码
// import { PrismaClient } from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET() {
  // 临时返回空数据，先让构建通过
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  return NextResponse.json({});
}

export async function PUT(request: Request) {
  return NextResponse.json({});
}

export async function DELETE(request: Request) {
  return NextResponse.json({ success: true });
}