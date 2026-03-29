import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", rollno: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:5000/api/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/students/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5000/api/students", form);
    }
    setForm({ name: "", email: "", rollno: "" });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      rollno: student.rollno,
    });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="container">
      <h1>Student CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="rollno"
          placeholder="Roll No"
          value={form.rollno}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.rollno}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
