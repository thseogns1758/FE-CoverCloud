"use client";

import React from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type Playlist = {
  id: number;
  title: string;
  description?: string;
};

type SortablePlaylistListProps = {
  playlists: Playlist[];
  onChange: React.Dispatch<React.SetStateAction<Playlist[]>>;
};

type SortablePlaylistItemProps = {
  playlist: Playlist;
};

const SortablePlaylistItem = ({ playlist }: SortablePlaylistItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: playlist.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 1,
    position: "relative",
    zIndex: isDragging ? 9999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border bg-white p-4"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab select-none rounded border px-2 py-1 text-sm active:cursor-grabbing"
      >
        ≡
      </button>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{playlist.title}</h3>

        {playlist.description && (
          <p className="mt-1 truncate text-sm text-gray-500">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  );
};

const SortablePlaylistList = ({
  playlists,
  onChange,
}: SortablePlaylistListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = playlists.findIndex(
      (playlist) => playlist.id === active.id,
    );
    const newIndex = playlists.findIndex((playlist) => playlist.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    onChange((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  if (playlists.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        아직 만든 플레이리스트가 없습니다.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={playlists.map((playlist) => playlist.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {playlists.map((playlist) => (
            <SortablePlaylistItem key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortablePlaylistList;
