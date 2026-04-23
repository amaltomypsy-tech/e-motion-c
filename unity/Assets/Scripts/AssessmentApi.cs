using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace EIStoryAssessment
{
    [Serializable]
    public class CreateSessionRequest
    {
        public string ageGroup;
    }

    [Serializable]
    public class CreateSessionResponse
    {
        public string anonymousUserId;
        public string sessionId;
        public string ageGroup;
        public string[] scenarioOrder;
        public string createdAt;
    }

    [Serializable]
    public class SaveResponseRequest
    {
        public string anonymousUserId;
        public string sessionId;
        public string levelId;
        public string selectedOptionId;
        public long latencyMs;
        public int changedSelectionCount;
    }

    public class AssessmentApi : MonoBehaviour
    {
        [Tooltip("For local dev, keep empty to use current origin (same host as Next.js). If hosting separately, set full base URL.")]
        public string baseUrl = "";

        private string Url(string path)
        {
            if (string.IsNullOrEmpty(baseUrl)) return path; // relative to current origin
            return baseUrl.TrimEnd('/') + path;
        }

        public IEnumerator CreateSession(string ageGroup, Action<CreateSessionResponse> onOk, Action<string> onError)
        {
            var payload = JsonUtility.ToJson(new CreateSessionRequest { ageGroup = ageGroup });
            using (var req = new UnityWebRequest(Url("/api/session"), "POST"))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(payload);
                req.uploadHandler = new UploadHandlerRaw(bodyRaw);
                req.downloadHandler = new DownloadHandlerBuffer();
                req.SetRequestHeader("Content-Type", "application/json");

                yield return req.SendWebRequest();

                if (req.result != UnityWebRequest.Result.Success)
                {
                    onError?.Invoke(req.error);
                    yield break;
                }

                try
                {
                    var data = JsonUtility.FromJson<CreateSessionResponse>(req.downloadHandler.text);
                    onOk?.Invoke(data);
                }
                catch (Exception ex)
                {
                    onError?.Invoke("Parse error: " + ex.Message);
                }
            }
        }

        public IEnumerator GetScenario(string levelId, Action<string> onOkJson, Action<string> onError)
        {
            var url = Url("/api/scenarios?levelId=" + UnityWebRequest.EscapeURL(levelId));
            using (var req = UnityWebRequest.Get(url))
            {
                req.downloadHandler = new DownloadHandlerBuffer();
                yield return req.SendWebRequest();
                if (req.result != UnityWebRequest.Result.Success)
                {
                    onError?.Invoke(req.error);
                    yield break;
                }
                onOkJson?.Invoke(req.downloadHandler.text);
            }
        }

        public IEnumerator SaveResponse(SaveResponseRequest body, Action<string> onOkJson, Action<string> onError)
        {
            var payload = JsonUtility.ToJson(body);
            using (var req = new UnityWebRequest(Url("/api/response"), "POST"))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(payload);
                req.uploadHandler = new UploadHandlerRaw(bodyRaw);
                req.downloadHandler = new DownloadHandlerBuffer();
                req.SetRequestHeader("Content-Type", "application/json");

                yield return req.SendWebRequest();

                if (req.result != UnityWebRequest.Result.Success)
                {
                    onError?.Invoke(req.error);
                    yield break;
                }

                onOkJson?.Invoke(req.downloadHandler.text);
            }
        }
    }
}

