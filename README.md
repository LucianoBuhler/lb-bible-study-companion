# lb-bible-study-companion

## Features
A comprehensive Bible study companion application with AI-powered search, commentary, cross-references, and quiz generation for deeper scriptural understanding.
- **Advanced Bible Search**: Search by verse reference, topic, commentary, or cross-references
- **Commentary Integration**: Access scholarly commentary from various sources
- **Study Sessions**: Save and organize your Bible study sessions
- **Quiz Mode**: Test your biblical knowledge with generated questions
- **Cross-References**: Discover related verses and themes
- **User Notes**: Add personal study notes to verses
- **Progress Tracking**: Track your reading and study progress
## Database Setup
The application uses Supabase for data storage. To set up the database:
1. **Run the migration**: The database schema will be automatically created when you connect to Supabase

2. **Load Bible data**: Use the provided scripts to populate your database with biblical content:

   ```bash
   # Load sample Bible data (quick setup)
   npm run load-bible
   
   # Load extended Bible data (more comprehensive, takes longer)
   npm run load-extended-bible
   ```
## Data Loading Scripts
### Basic Bible Data (`npm run load-bible`)
- Loads all 66 Bible books
- Includes 10 sample verses from popular passages
- Adds sample commentary from various scholars
- Creates sample quiz questions
- **Estimated time**: 1-2 minutes

### Extended Bible Data (`npm run load-extended-bible`)
- Loads popular chapters in full (Genesis 1, Psalm 23, John 3, etc.)
- Includes extended commentary from multiple sources
- Creates cross-references between related verses
- **Estimated time**: 5-10 minutes (due to API rate limits)
- **Note**: Uses the Bible API for verse content

## Environment Variables

Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Load Bible data (run after setting up Supabase)
npm run load-bible
```

## Database Schema

The application includes the following main tables:
- `books` - Bible books (Genesis, Exodus, etc.)
- `verses` - Individual Bible verses with text
- `commentaries` - Commentary entries for verses
- `cross_references` - Cross-reference relationships
- `study_notes` - User-created study notes
- `study_sessions` - User study sessions
- `quiz_questions` - Generated quiz questions
- `user_favorites` - User favorite verses
- `user_progress` - Reading/study progress tracking

All tables include Row Level Security (RLS) policies for proper data access control.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.