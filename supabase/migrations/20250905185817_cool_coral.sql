@@ .. @@
 ALTER TABLE books ENABLE ROW LEVEL SECURITY;
 
 CREATE POLICY "Books are publicly readable"
   ON books
   FOR SELECT
   TO public
   USING (true);
+
+CREATE POLICY "Service role can manage books"
+  ON books
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);
 
 -- Verses table
 CREATE TABLE IF NOT EXISTS verses (
@@ .. @@
 ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
 
 CREATE POLICY "Verses are publicly readable"
   ON verses
   FOR SELECT
   TO public
   USING (true);
+
+CREATE POLICY "Service role can manage verses"
+  ON verses
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);
 
 -- Commentaries table
 CREATE TABLE IF NOT EXISTS commentaries (
@@ .. @@
 ALTER TABLE commentaries ENABLE ROW LEVEL SECURITY;
 
 CREATE POLICY "Commentaries are publicly readable"
   ON commentaries
   FOR SELECT
   TO public
   USING (true);
+
+CREATE POLICY "Service role can manage commentaries"
+  ON commentaries
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);
 
 -- Cross references table
 CREATE TABLE IF NOT EXISTS cross_references (
@@ .. @@
 ALTER TABLE cross_references ENABLE ROW LEVEL SECURITY;
 
 CREATE POLICY "Cross references are publicly readable"
   ON cross_references
   FOR SELECT
   TO public
   USING (true);
+
+CREATE POLICY "Service role can manage cross references"
+  ON cross_references
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);
 
 -- Study notes table (user-specific)
 CREATE TABLE IF NOT EXISTS study_notes (
@@ .. @@
 ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
 
 CREATE POLICY "Quiz questions are publicly readable"
   ON quiz_questions
   FOR SELECT
   TO public
   USING (true);
+
+CREATE POLICY "Service role can manage quiz questions"
+  ON quiz_questions
+  FOR ALL
+  TO service_role
+  USING (true)
+  WITH CHECK (true);
 
 -- User favorites table
 CREATE TABLE IF NOT EXISTS user_favorites (