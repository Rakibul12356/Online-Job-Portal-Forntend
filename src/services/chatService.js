import { apiClient } from '@/api';

export const chatService = {
  /**
   * Get all active chat rooms for the current user.
   */
  async getRooms() {
    return apiClient.get('/chats');
  },

  /**
   * Get historical messages for a given room.
   * @param {string} roomId
   */
  async getMessages(roomId) {
    return apiClient.get(`/chats/${roomId}/messages`);
  },

  /**
   * Open or retrieve an existing chat room for a job.
   * Optionally pass seekerId (useful for employer initiating chat).
   * @param {string} jobId
   * @param {string} [seekerId]
   */
  async getOrCreateRoom(jobId, seekerId = null) {
    const payload = { jobId };
    if (seekerId) {
      payload.seekerId = seekerId;
    }
    return apiClient.post('/chats', payload);
  },
};

export default chatService;
