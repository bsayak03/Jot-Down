import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { Pencil, Trash2, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableNote, setEditableNote] = useState({
    title: "",
    description: "",
  });
  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated]);

  const fetchNotes = async () => {
    const userId = user.email.split("@")[0];

    const res = await axios.get(`${BACKEND_URL}/notes/${userId}`);

    setNotes(res.data.notes);
    setFilteredNotes(res.data.notes);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    const userId = user.email.split("@")[0];
    await axios.post(`${BACKEND_URL}/note/${userId}`, {
      title,
      description,
    });
    setTitle("");
    setDescription("");
    setIsCreating(false);
    fetchNotes();
  };

  const handleUpdateNote = async (noteId) => {
    const userId = user.email.split("@")[0];
    await axios.put(`${BACKEND_URL}/note/${userId}/${noteId}`, {
      title: editableNote.title,
      description: editableNote.description,
    });
    setEditingNoteId(null);
    setEditableNote({ title: "", description: "" });
    fetchNotes();
  };

  const handleDeleteNote = async (noteId) => {
    const userId = user.email.split("@")[0];
    await axios.delete(`${BACKEND_URL}/notes/${userId}/${noteId}`);
    fetchNotes();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditableNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <Pencil className="h-8 w-8 text-purple-600" />
          <span className="text-2xl font-bold text-purple-600">Jot Down</span>
        </motion.div>
        <Button
          onClick={() => logout({ returnTo: window.location.origin })}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notes..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note._id} className="relative">
              <CardHeader>
                <CardTitle>
                  {editingNoteId === note._id ? (
                    <Input
                      name="title"
                      value={editableNote.title}
                      onChange={handleEditInputChange}
                    />
                  ) : (
                    note.title
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingNoteId === note._id ? (
                  <Textarea
                    name="description"
                    value={editableNote.description}
                    onChange={handleEditInputChange}
                  />
                ) : (
                  <p>{note.description}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    editingNoteId === note._id
                      ? handleUpdateNote(note._id)
                      : (setEditingNoteId(note._id),
                        setEditableNote({
                          title: note.title,
                          description: note.description,
                        }))
                  }
                  className="hover:bg-purple-100"
                >
                  <Pencil className="h-4 w-4 text-gray-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(note._id)}
                  className="hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-gray-700" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setIsCreating(true)}
          >
            <AddIcon style={{ fontSize: 30 }} />
          </Button>
        </motion.div>

        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <Card className="w-full max-w-md bg-white">
              <form onSubmit={handleCreateNote}>
                <CardHeader>
                  <CardTitle>Create New Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsCreating(false)}
                    className="hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    type="submit"
                  >
                    Create
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
