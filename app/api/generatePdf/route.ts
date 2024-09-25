import { NextRequest, NextResponse } from 'next/server';
import { generateImmunizationPDF } from '@/app/_lib/data-service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const childId = searchParams.get('childId');

  if (!childId) {
    return NextResponse.json(
      { message: 'Child ID is required' },
      { status: 400 }
    );
  }

  try {
    const pdfBytes = await generateImmunizationPDF(childId);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=immunization-records.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { message: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
