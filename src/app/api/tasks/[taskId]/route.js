import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";

//  Actualizare task (PUT)
export async function PUT(req, { params }) {
  const { taskId } = params;
  await connectToDatabase();

  const body = await req.json();
  const { completed } = body;

  if (typeof completed !== 'boolean') {
    return new Response(JSON.stringify({ error: "Starea completării este obligatorie" }), {
      status: 400,
    });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed },
      { new: true }
    );
    return new Response(JSON.stringify(updatedTask), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Eroare la actualizarea task-ului" }), {
      status: 500,
    });
  }
}

// Ștergere task (DELETE)
export async function DELETE(req, { params }) {
  const { taskId } = params;
  await connectToDatabase();

  try {
    await Task.findByIdAndDelete(taskId);
    return new Response(JSON.stringify({ message: "Task șters cu succes" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Eroare la ștergerea task-ului" }), {
      status: 500,
    });
  }
}
