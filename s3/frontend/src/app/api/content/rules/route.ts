import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const rulesPath = path.join(process.cwd(), 'src/content/rules/content-rules.json');
    const rulesData = fs.readFileSync(rulesPath, 'utf-8');
    const rules = JSON.parse(rulesData);
    
    return NextResponse.json(rules);
  } catch (error) {
    console.error('Error loading content rules:', error);
    return NextResponse.json(
      { error: 'Failed to load content rules' },
      { status: 500 }
    );
  }
}
