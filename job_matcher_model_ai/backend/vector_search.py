# vector_search.py
# Save this as a new file in your project

from sentence_transformers import SentenceTransformer
import chromadb
import json
from datetime import datetime

class VectorJobMatcher:
    """
    Semantic job matching using AI embeddings
    Finds similar jobs even if words are different
    Example: "Python developer" matches "Software engineer with Python"
    """
    
    def __init__(self):
        print("🔄 Loading AI embedding model...")
        
        # Load multilingual model (supports Arabic + English)
        self.embedder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        
        # Initialize ChromaDB (local vector database)
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        
        # Create collection for jobs
        self.job_collection = self.chroma_client.get_or_create_collection(
            name="mena_jobs",
            metadata={"description": "MENA job postings"}
        )
        
        print("✅ Vector search ready!")
    
    def add_job_to_database(self, job_id, job_data):
        """
        Add a job to the vector database
        
        Args:
            job_id: Unique job identifier (e.g., "job_001")
            job_data: Dict with title, description, required_skills, location
        """
        
        # Create searchable text combining all job info
        searchable_text = f"""
        Title: {job_data.get('title', '')}
        Description: {job_data.get('description', '')}
        Location: {job_data.get('location', '')}
        Skills: {', '.join([
            s.get('name', s) if isinstance(s, dict) else str(s) 
            for s in job_data.get('required_skills', [])
        ])}
        Type: {job_data.get('type', '')}
        """
        
        # Generate embedding (converts text to 384-dimensional vector)
        embedding = self.embedder.encode(searchable_text).tolist()
        
        # Store in ChromaDB
        self.job_collection.add(
            ids=[job_id],
            embeddings=[embedding],
            documents=[searchable_text],
            metadatas=[{
                "title": job_data.get('title', 'Unknown'),
                "location": job_data.get('location', 'N/A'),
                "type": job_data.get('type', 'Full-time'),
                "added_at": datetime.now().isoformat()
            }]
        )
    
    def find_matching_jobs(self, cv_skills, cv_text="", top_k=10):
        """
        Find jobs matching CV skills using semantic search
        
        Args:
            cv_skills: List of skills from CV
            cv_text: Full CV text (optional)
            top_k: Number of results to return
            
        Returns:
            List of matching jobs with scores
        """
        try:
            count = self.job_collection.count()
        
            if count == 0:
                print("⚠️ Vector database is empty. Populating now...")
                # Try to populate from existing jobs
                try:
                    from candidate_app import load_job_descriptions
                    jobs = load_job_descriptions()
                    
                    if jobs:
                        self.populate_with_existing_jobs(jobs)
                        count = self.job_collection.count()
                    else:
                        print("❌ No jobs found in job_descriptions.json")
                        return []
                except Exception as e:
                    print(f"❌ Error populating: {e}")
                    return []
            
            # Ensure we don't request more results than available
            actual_top_k = min(top_k, count)
            
            if actual_top_k == 0:
                print("❌ No jobs in database")
                return []
            
        # Create query text from skills
            query_text = f"Looking for jobs requiring: {', '.join(cv_skills)}"
        
            if cv_text:
                query_text += f" {cv_text[:500]}"
        
        # Generate query embedding
            query_embedding = self.embedder.encode(query_text).tolist()
        
        # Search vector database
        
            results = self.job_collection.query(
                    query_embeddings=[query_embedding],
                    n_results=min(top_k, self.job_collection.count())
                )
            
            # Format results
            matches = []
            
            if results and results['ids'] and len(results['ids']) > 0:
                    for i, job_id in enumerate(results['ids'][0]):
                        # Calculate similarity score (0-100%)
                        distance = results['distances'][0][i]
                        similarity_score = max(0, (1 - distance) * 100)
                        
                        matches.append({
                            'job_id': job_id,
                            'title': results['metadatas'][0][i].get('title', 'Unknown'),
                            'location': results['metadatas'][0][i].get('location', 'N/A'),
                            'type': results['metadatas'][0][i].get('type', 'Full-time'),
                            'match_score': round(similarity_score, 2)
                        })
            
            return matches
            
        except Exception as e:
            print(f"Vector search error: {e}")
            return []
      
    def populate_with_existing_jobs(self, job_descriptions):
        """
        Load existing jobs from job_descriptions.json into vector DB
        
        Args:
            job_descriptions: Dict from load_job_descriptions()
        """
        
        count = 0
        for job_title, job_data in job_descriptions.items():
            if isinstance(job_data, dict):
                # Create unique ID from title
                job_id = f"job_{job_title.replace(' ', '_').lower()}"
                
                try:
                    self.add_job_to_database(job_id, {
                        'title': job_title,
                        'description': job_data.get('description', ''),
                        'location': job_data.get('location', ''),
                        'required_skills': job_data.get('required_skills', []),
                        'type': job_data.get('type', 'Full-time')
                    })
                    count += 1
                except Exception as e:
                    print(f"Error adding job {job_title}: {e}")
        
        print(f"✅ Added {count} jobs to vector database")
        return count


# ============================================
# INITIALIZE GLOBALLY (do this once)
# ============================================

print("🚀 Initializing vector search system...")
vector_matcher = VectorJobMatcher()
print("✅ Vector search initialized!")


# ============================================
# HELPER FUNCTION to populate on startup
# ============================================

def initialize_vector_db_with_jobs():
    """Call this once to populate vector DB with existing jobs"""
    try:
        # Import your load function
        from candidate_app import load_job_descriptions
        
        jobs = load_job_descriptions()
        
        if jobs:
            vector_matcher.populate_with_existing_jobs(jobs)
            print(f"✅ Vector DB populated with {len(jobs)} jobs")
        else:
            print("⚠️ No jobs found to populate")
            
    except Exception as e:
        print(f"❌ Error populating vector DB: {e}")


# Run on import
if __name__ != "__main__":
    initialize_vector_db_with_jobs()