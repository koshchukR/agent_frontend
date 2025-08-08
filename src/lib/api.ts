const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL

interface HubSpotContact {
  id: string
  properties: {
    firstname?: string
    lastname?: string
    email?: string
    phone?: string
    jobtitle?: string
    company?: string
    lifecyclestage?: string
    createdate?: string
  }
}

export interface Candidate {
  id: string
  name: string
  position: string
  status: string
  score?: number
  source: string
  date: string
  botRisk: string
  phone: string
  email?: string
}

class ApiService {
  private async fetchFromBackend(endpoint: string) {
    if (!API_BASE_URL) {
      throw new Error('Backend API URL is not configured. Please check your .env file.')
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async getHubSpotContacts(): Promise<Candidate[]> {
    try {
      const data = await this.fetchFromBackend('/api/contacts')
      
      // Transform HubSpot contacts to our Candidate format
      const hubspotCandidates: Candidate[] = data.results?.map((contact: HubSpotContact) => ({
        id: contact.id,
        name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim() || 'Unknown',
        position: contact.properties.jobtitle || 'Not specified',
        status: this.mapLifecycleStageToStatus(contact.properties.lifecyclestage),
        score: this.generateScore(contact),
        source: 'HubSpot',
        date: contact.properties.createdate ? new Date(contact.properties.createdate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        botRisk: 'Low',
        phone: contact.properties.phone || '',
        email: contact.properties.email || ''
      })) || []

      return hubspotCandidates
    } catch (error) {
      console.error('Error fetching HubSpot contacts:', error)
      throw error
    }
  }

  private mapLifecycleStageToStatus(lifecycleStage?: string): string {
    const statusMap: { [key: string]: string } = {
      'lead': 'New',
      'marketingqualifiedlead': 'Qualified',
      'salesqualifiedlead': 'Screening',
      'opportunity': 'In Progress',
      'customer': 'Completed',
      'evangelist': 'Completed'
    }
    
    return statusMap[lifecycleStage?.toLowerCase() || ''] || 'New'
  }

  private generateScore(contact: HubSpotContact): number {
    let score = 50 // Base score
    
    // Add points for having complete information
    if (contact.properties.firstname) score += 10
    if (contact.properties.lastname) score += 10
    if (contact.properties.email) score += 15
    if (contact.properties.phone) score += 10
    if (contact.properties.jobtitle) score += 5
    
    // Random factor to make it more realistic
    score += Math.floor(Math.random() * 20)
    
    return Math.min(score, 100)
  }
}

export const apiService = new ApiService()