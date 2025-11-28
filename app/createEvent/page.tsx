
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Move SuccessToast outside of CreateEvent
const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed top-5 right-5 z-50 animate-slide-in">
    <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
      <span className="text-lg">✔️</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white text-xl">×</button>
    </div>
  </div>
);

export default function CreateEvent() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    mode: "",
    organizer: "",
    audience: "",
    overview: "",
    description: "",
    tags: [] as string[],
    agenda: "",
    image: null as File | null,
  });

  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  // -----------------------------
  // Handle changes for all text inputs
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Handle Tag Add
  // -----------------------------
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  // -----------------------------
  // Handle Image Upload + Preview
  // -----------------------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm({ ...form, image: file });

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // -----------------------------
  // Submit Handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("venue", form.venue);
      formData.append("location", form.location);
      formData.append("mode", form.mode);
      formData.append("organizer", form.organizer);
      formData.append("audience", form.audience);
      formData.append("overview", form.overview);
      formData.append("description", form.description);
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("agenda", JSON.stringify([form.agenda])); // store as array

      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Event creation failed");
      } else {
       setSuccess(true);
       // Reset form
  setForm({
    title: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    mode: "",
    organizer: "",
    audience: "",
    overview: "",
    description: "",
    tags: [],
    agenda: "",
    image: null,
  });

  setPreview(null);
  setTimeout(() => {
  router.push("/");
}, 1200);
    
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }

    setLoading(false);
  };


  // =================================================================
  // UI
  // =================================================================
  return (

    
    <section className="w-full flex flex-col items-center">
      <h1 className="text-gradient text-5xl mt-10">Create an Event</h1>

      <div className="glass card-shadow w-full max-w-3xl p-8 mt-10 rounded-xl space-y-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Venue */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Venue</label>
            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Mode */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Type</label>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            >
              <option value="">Select event type</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Audience */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Audience</label>
            <input
              type="text"
              name="audience"
              value={form.audience}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Organizer */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Organizer</label>
            <input
              type="text"
              name="organizer"
              value={form.organizer}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
              required
            />
          </div>

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          {/* Agenda */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Agenda</label>
            <textarea
              name="agenda"
              value={form.agenda}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-3 h-32 resize-none"
              required
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Tags</label>
            <input
              type="text"
              placeholder="Add tags such as react, next_js"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-dark-200 rounded-lg px-5 py-2.5"
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag, index) => (
                <span
                  key={index}
                  className="pill cursor-pointer"
                  onClick={() =>
                    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
                  }
                >
                  {tag} ×
                </span>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Overview</label>
            <textarea
              name="overview"
              value={form.overview}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-3 h-32 resize-none"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-light-100">Event Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="bg-dark-200 rounded-lg px-5 py-3 h-32 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 rounded-lg py-3 text-black font-semibold mt-4"
          >
            {loading ? "Saving..." : "Save Event"}
          </button>
        </form>
      </div>
      {success && (
  <SuccessToast
    message="Event created successfully!"
    onClose={() => setSuccess(false)}
  />
)}

    </section>
  );
}
