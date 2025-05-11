import connectToDatabase from "@/lib/mongodb";

import Task from "@/models/Task";

// GET - Obține toate task-urile
export async function GET() {
  await connectToDatabase();
  
  try {
    const tasks = await Task.find();
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Eroare la citirea task-urilor" }), {
      status: 500,
    });
  }
}

// POST - Adaugă un task
// export async function POST(req) {
//   await connectToDatabase();

//   const body = await req.json();
//   const { title } = body;

//   if (!title) {
//     return new Response(JSON.stringify({ error: "Titlul este obligatoriu" }), {
//       status: 400,
//     });
//   }

//   try {
//     const newTask = await Task.create({ title });
//     return new Response(JSON.stringify(newTask), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Eroare la adăugarea task-ului" }), {
//       status: 500,
//     });
//   }
// }
export async function POST(req) {
  await connectToDatabase();

  const body = await req.json();
  const { title, deadline } = body;

  if (!title) {
    return new Response(JSON.stringify({ error: "Titlul este obligatoriu" }), {
      status: 400,
    });
  }

  try {
    const newTask = await Task.create({ title, deadline });
    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Eroare la adăugarea task-ului" }), {
      status: 500,
    });
  }
}

