@@ .. @@
 -- Enable RLS on verses table
 ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

--- Create policy for public read access to verses
+-- Create policies for verses table
 CREATE POLICY "Verses are publicly readable"
   ON verses
   FOR SELECT
   TO public
   USING (true);

+-- Allow service role to manage verses
+CREATE POLICY "Service role can manage verses"
+  ON verses
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);