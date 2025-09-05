@@ .. @@
 -- Enable RLS on commentaries table
 ALTER TABLE commentaries ENABLE ROW LEVEL SECURITY;

--- Create policy for public read access to commentaries
+-- Create policies for commentaries table
 CREATE POLICY "Commentaries are publicly readable"
   ON commentaries
   FOR SELECT
   TO public
   USING (true);

+-- Allow service role to manage commentaries
+CREATE POLICY "Service role can manage commentaries"
+  ON commentaries
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);