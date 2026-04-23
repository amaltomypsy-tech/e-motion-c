using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace EIStoryAssessment
{
    public class AssessmentGameController : MonoBehaviour
    {
        [Header("API")]
        public AssessmentApi api;

        [Header("UI")]
        public Text titleText;
        public Text branchText;
        public Text contextText;
        public Text promptText;
        public Button[] optionButtons; // 3-4
        public Text[] optionTitles;
        public Text[] optionDescriptions;
        public Text statusText;

        [Header("Session (runtime)")]
        public string ageGroup = "18-21";

        private string anonymousUserId;
        private string sessionId;
        private List<string> scenarioOrder = new List<string>();
        private int currentIndex = 0;

        private string selectedOptionId = null;
        private int changedSelectionCount = 0;
        private long levelStartMs = 0;

        void Start()
        {
            if (api == null) api = GetComponent<AssessmentApi>();
            statusText.text = "Starting session…";
            StartCoroutine(api.CreateSession(ageGroup, OnSessionCreated, OnError));
        }

        void OnSessionCreated(CreateSessionResponse s)
        {
            anonymousUserId = s.anonymousUserId;
            sessionId = s.sessionId;
            scenarioOrder = new List<string>(s.scenarioOrder ?? new string[0]);
            currentIndex = 0;
            LoadCurrentScenario();
        }

        void LoadCurrentScenario()
        {
            if (scenarioOrder.Count == 0)
            {
                statusText.text = "No scenarios configured.";
                return;
            }

            selectedOptionId = null;
            changedSelectionCount = 0;
            levelStartMs = NowMs();

            var levelId = scenarioOrder[currentIndex];
            statusText.text = "Loading scenario…";
            StartCoroutine(api.GetScenario(levelId, OnScenarioJson, OnError));
        }

        void OnScenarioJson(string json)
        {
            // JsonUtility cannot parse nested arrays with unknown fields reliably in all cases.
            // For a production Unity client, prefer Newtonsoft JSON. For prototype, this is OK if schema stays simple.
            var scenario = JsonUtility.FromJson<ScenarioLevel>(json);

            titleText.text = scenario.title;
            branchText.text = scenario.branchPrimary;
            contextText.text = scenario.narrative != null ? scenario.narrative.context : "";
            promptText.text = scenario.narrative != null ? scenario.narrative.prompt : "";

            statusText.text = $"Item {currentIndex + 1}/{scenarioOrder.Count}";

            for (int i = 0; i < optionButtons.Length; i++)
            {
                bool has = scenario.options != null && i < scenario.options.Length;
                optionButtons[i].gameObject.SetActive(has);
                if (!has) continue;

                var opt = scenario.options[i];
                optionTitles[i].text = opt.label;
                optionDescriptions[i].text = opt.description;

                int idx = i;
                optionButtons[i].onClick.RemoveAllListeners();
                optionButtons[i].onClick.AddListener(() => SelectOption(opt.optionId, idx));
            }
        }

        void SelectOption(string optionId, int uiIndex)
        {
            if (selectedOptionId != null && selectedOptionId != optionId) changedSelectionCount += 1;
            selectedOptionId = optionId;
            statusText.text = "Option selected. Submit when ready.";
        }

        public void SubmitSelection()
        {
            if (string.IsNullOrEmpty(selectedOptionId))
            {
                statusText.text = "Select an option first.";
                return;
            }

            var levelId = scenarioOrder[currentIndex];
            var latency = NowMs() - levelStartMs;

            statusText.text = "Submitting…";
            var req = new SaveResponseRequest
            {
                anonymousUserId = anonymousUserId,
                sessionId = sessionId,
                levelId = levelId,
                selectedOptionId = selectedOptionId,
                latencyMs = latency,
                changedSelectionCount = changedSelectionCount
            };

            StartCoroutine(api.SaveResponse(req, OnSaved, OnError));
        }

        void OnSaved(string _)
        {
            currentIndex += 1;
            if (currentIndex >= scenarioOrder.Count)
            {
                statusText.text = "Complete. Open /dashboard in the web app to view the report.";
                return;
            }
            LoadCurrentScenario();
        }

        void OnError(string msg)
        {
            statusText.text = "Error: " + msg;
        }

        long NowMs()
        {
            return (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds;
        }
    }
}

