@@ .. @@
 -- Enable RLS on quiz_questions table
 ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

--- Create policy for public read access to quiz questions
+-- Create policies for quiz_questions table
 CREATE POLICY "Quiz questions are publicly readable"
   ON quiz_questions
   FOR SELECT
   TO public
   USING (true);

+-- Allow service role to manage quiz questions
+CREATE POLICY "Service role can manage quiz questions"
+  ON quiz_questions
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);