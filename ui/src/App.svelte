<script>
  import { onMount } from "svelte";
  let notes = [];
  let newNote = "";
  const API_URL = "http://localhost:5038/";

  // Fetch notes when component mounts
  onMount(async () => {
    await refreshNotes();
  });

  const refreshNotes = async () => {
  try {
    const response = await fetch(API_URL + "api/todoapp/GetNotes");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    notes = data;
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};

  const addClick = async () => {
    try {
      await fetch(API_URL + "api/todoapp/AddNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newNotes: newNote }),
      });
      await refreshNotes();
      newNote = "";
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteClick = async (id) => {
    try {
      await fetch(API_URL + `api/todoapp/DeleteNotes?id=${id}`, {
        method: "DELETE",
      });
      await refreshNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
</script>


<div class="container">
  <header>
    <h1 class="text-center font-semibold text-2xl">ToDo App</h1>

    <div class="input-area">
      <input
        class="input text-black px-2 h-10 w-80"
        bind:value={newNote}
        placeholder="Enter your note"
      />
      <button class="btn" on:click={addClick}>
        Add Note
      </button>
    </div>

    <div class="notes-area">
      {#each notes as note (note.id)}
        <div class="note-item">
          <b>{note.description}</b>
          <button class="btn bg-red-500 text-white px-4 py-2" on:click={() => deleteClick(note.id)}>
            Delete
          </button>
        </div>
      {/each}
    </div>
  </header>
</div>

<style>
  .container {
    background-color: #64748b;
    min-height: 100vh;
    padding-top: 2rem;
  }
  h1 {
    color: #fbbf24;
  }
  .input-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  .notes-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  .note-item {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }
</style>