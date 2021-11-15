import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
// eslint-disable-next-line import/named
import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'

const token = core.getInput('GH_TOKEN', {required: true})
const issueNumber = parseInt(core.getInput('ISSUE_NUMBER', {required: true}))
const projectName = core.getInput('PROJECT_NAME')
const sourceColumnName = core.getInput('SOURCE_COLUMN')
const targetColumnName = core.getInput('TARGET_COLUMN', {required: true})

const octokit = new Octokit({auth: token})

async function run(): Promise<void> {
  try {
    let projects = (
      await octokit.rest.projects.listForRepo({
        owner: (process.env.GITHUB_REPOSITORY as string).split('/')[0],
        repo: (process.env.GITHUB_REPOSITORY as string).split('/')[1]
      })
    ).data

    if (projectName) {
      projects = projects.filter(project => project.name === projectName)
    }

    for (const project of projects) {
      core.info(`Going over Project ${project.name}..`)

      let targetColumn:
        | RestEndpointMethodTypes['projects']['listColumns']['response']['data'][0]
        | undefined
      let issueCard:
        | RestEndpointMethodTypes['projects']['listCards']['response']['data'][0]
        | undefined

      const columns = (
        await octokit.rest.projects.listColumns({
          project_id: project.id
        })
      ).data

      for (const column of columns) {
        if (column.name === targetColumnName) {
          targetColumn = column
          continue
        }

        if (
          !sourceColumnName ||
          (sourceColumnName && column.name === sourceColumnName)
        ) {
          core.info(`Going over Column ${column.name}..`)

          const cards = (
            await octokit.rest.projects.listCards({
              column_id: column.id
            })
          ).data

          for (const card of cards) {
            if (
              card.content_url ===
              `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues/${issueNumber}`
            ) {
              issueCard = card
              break
            }
          }
        }
      }

      if (issueCard && targetColumn) {
        core.info(`Moving card ${issueCard.id} to ${targetColumn.name}..`)

        octokit.rest.projects.moveCard({
          card_id: issueCard.id,
          position: core.getInput('CARD_POSITION') || 'bottom',
          column_id: targetColumn.id
        })
      }
    }
  } catch (error) {
    core.setFailed(`Workflow failed! ${(error as Error).message || error}`)
  }
}

run()
