import { ref, type Ref } from 'vue'
import { parseStudioSession, type StudioSession } from '../../editor'

export const projectPrefix = 'id-studio:project:2:'

export function useStudioProjects(notice: Ref<string>) {
  const projects = ref<StudioSession[]>([])
  function listProjects() {
    const saved: StudioSession[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(projectPrefix)) continue
      try {
        saved.push(parseStudioSession(JSON.parse(localStorage.getItem(key)!)))
      }
      catch {
        notice.value = 'A saved project could not be read. Other projects are still available.'
      }
    }
    projects.value = saved.sort((a, b) => b.updatedAt - a.updatedAt)
  }
  function saveProject(session: StudioSession) {
    localStorage.setItem(projectPrefix + session.id, JSON.stringify(session))
    window.dispatchEvent(new Event('id-studio-projects-changed'))
  }
  function deleteProject(id: string) {
    localStorage.removeItem(projectPrefix + id)
    window.dispatchEvent(new Event('id-studio-projects-changed'))
  }
  return { projects, listProjects, saveProject, deleteProject }
}
