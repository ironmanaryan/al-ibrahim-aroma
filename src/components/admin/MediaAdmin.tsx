"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaItem } from "@/lib/types";
import { adminApi } from "@/lib/adminClient";
import { Copy, ImageIcon, Trash, Upload } from "../icons";
import { useToast } from "../Toast";

function prettySize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaAdmin({ initial }: { initial: MediaItem[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const data = await adminApi<{ item: MediaItem }>("/api/admin/media", {
          method: "POST",
          body: form,
        });
        setItems((prev) => [data.item, ...prev]);
      }
      notify(files.length > 1 ? "Images uploaded" : "Image uploaded");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      await adminApi(`/api/admin/media/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((m) => m.id !== item.id));
      notify("Image deleted");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not delete");
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      notify("URL copied to clipboard");
    } catch {
      notify("Copy failed — select the URL manually");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Media</h1>
          <p>
            Uploads are stored in the house library and referenced by URL. Use them for journal covers,
            campaign stills or product imagery.
          </p>
        </div>
        <div className="admin-actions">
          <button
            className="admin-btn admin-btn--gold"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <Upload size={14} /> {busy ? "Uploading…" : "Upload image"}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => upload(e.target.files)}
      />

      <div
        className="dropzone"
        style={{
          marginBottom: 20,
          borderColor: dragging ? "var(--a-gold)" : undefined,
          background: dragging ? "#fdfaf3" : undefined,
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <ImageIcon size={26} />
        <strong style={{ fontSize: 12, fontWeight: 400, color: "var(--a-ink)" }}>
          Drop images here, or click to browse
        </strong>
        <span style={{ fontSize: 10.5 }}>JPG, PNG, WebP or SVG · up to 2.5 MB each</span>
      </div>

      {items.length === 0 ? (
        <div className="empty" style={{ background: "var(--a-card)", borderColor: "var(--a-line)" }}>
          <p>The library is empty. Upload your first image above.</p>
        </div>
      ) : (
        <div className="media-grid">
          {items.map((item) => (
            <div className="media-card" key={item.id}>
              <div className="media-card__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} loading="lazy" />
              </div>
              <div className="media-card__body">
                <strong title={item.name}>{item.name}</strong>
                <small>
                  {prettySize(item.size)} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </small>
                <div className="media-card__actions">
                  <button
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => copy(item.url)}
                  >
                    <Copy size={11} /> Copy
                  </button>
                  <button
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => remove(item)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
