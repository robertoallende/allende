// RSS generation disabled - using external feeds only
// This endpoint returns a 404 to prevent RSS generation

export async function GET() {
  return new Response('RSS generation disabled', { 
    status: 404,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
