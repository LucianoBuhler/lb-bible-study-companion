@@ .. @@
 -- Enable RLS on books table
 ALTER TABLE books ENABLE ROW LEVEL SECURITY;

--- Create policy for public read access to books
+-- Create policies for books table
 CREATE POLICY "Books are publicly readable"
   ON books
   FOR SELECT
   TO public
   USING (true);

+-- Allow service role to insert/update books
+CREATE POLICY "Service role can manage books"
+  ON books
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);