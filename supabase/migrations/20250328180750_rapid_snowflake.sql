/*
  # Create videos table

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `video_title` (text, not null)
      - `video_description` (text, not null)
      - `code_snippets` (text)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `videos` table
    - Add policy for authenticated users to read videos
*/

-- Create the videos table with all columns
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_title text NOT NULL,
  video_description text NOT NULL,
  code_snippets text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create read policy for authenticated users
CREATE POLICY "Allow authenticated users to read videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
DO $$ 
BEGIN
  INSERT INTO videos (video_title, video_description, code_snippets) VALUES
  (
    'Getting Started with React',
    'Learn the basics of React including components, props, and state. This introductory lesson will help you understand the fundamentals of React development.',
    'import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}'
  ),
  (
    'Working with TypeScript',
    'Discover how to use TypeScript with React to build type-safe applications. Learn about interfaces, types, and generics.',
    'interface User {
  id: string;
  name: string;
  email: string;
}

function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}'
  ),
  (
    'Tailwind CSS Basics',
    'Master the fundamentals of Tailwind CSS. Learn how to style your components using utility classes and build responsive layouts.',
    '// Example of a card component with Tailwind CSS
function Card() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-2">
        Card Title
      </h3>
      <p className="text-gray-600">
        Card content goes here...
      </p>
    </div>
  );
}'
  );
END $$;