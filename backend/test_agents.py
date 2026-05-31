import json
from agents.intake_agent import IntakeAgentV2
from agents.classification_agent import ClassificationAgentV2
from agents.sentiment_agent import SentimentAgent
from agents.incident_cluster_agent import IncidentClusterAgent

def run_test():
    # 1. Intake
    intake = IntakeAgentV2()
    text = "Mere ghar ke samne gadha hai aur kuda pada hai Hazratganj me pichle 3 weeks se, bahut badbu aa rahi hai, emergency hai accident ho sakta hai"
    mobile = "9876543210"
    print("--- INTAKE AGENT ---")
    intake_res = intake.run(text, mobile)
    print(json.dumps(intake_res, indent=2))
    
    # 2. Classification
    classify = ClassificationAgentV2()
    # Add fake selected department to test fallback logic
    intake_res["selected_department"] = "pothole_road"
    print("\n--- CLASSIFICATION AGENT ---")
    classify_res = classify.run(intake_res)
    print(json.dumps(classify_res, indent=2))
    
    # 3. Sentiment
    sentiment = SentimentAgent()
    print("\n--- SENTIMENT AGENT ---")
    sentiment_res = sentiment.run(classify_res)
    print(json.dumps(sentiment_res, indent=2))
    
    # 4. Clustering 
    cluster = IncidentClusterAgent()
    sentiment_res["pincode"] = "226001" # Mock pincode for Hazratganj
    print("\n--- INCIDENT CLUSTER AGENT ---")
    cluster_res = cluster.run(sentiment_res)
    print(json.dumps(cluster_res, indent=2))

if __name__ == "__main__":
    run_test()
