import * as core from '@actions/core'
import {newOctokitInstance} from './internal/octokit'

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const githubToken = core.getInput('githubToken', {required: true})
core.setSecret(githubToken)
const octokit = newOctokitInstance(githubToken)

async function run(): Promise<void> {
    try {
        const rateLimit = await octokit.rateLimit.get({}).then(it => it.data)
        core.info("Rate limits: " + JSON.stringify(rateLimit, null, 2))

        core.setOutput(
            'coreLimit',
            rateLimit.resources.core?.limit ?? 5_000,
        )
        core.setOutput(
            'coreUsed',
            rateLimit.resources.core?.used ?? 0,
        )

        core.setOutput(
            'graphqlLimit',
            rateLimit.resources.graphql?.limit ?? 500_000,
        )
        core.setOutput(
            'graphqlUsed',
            rateLimit.resources.graphql?.used ?? 0,
        )

        core.setOutput(
            'searchLimit',
            rateLimit.resources.search?.limit ?? 10,
        )
        core.setOutput(
            'searchUsed',
            rateLimit.resources.search?.used ?? 0,
        )

        core.setOutput(
            'codeSearchLimit',
            rateLimit.resources.code_search?.limit ?? 10,
        )
        core.setOutput(
            'codeSearchUsed',
            rateLimit.resources.code_search?.used ?? 0,
        )

        core.setOutput(
            'integrationManifestLimit',
            rateLimit.resources.integration_manifest?.limit ?? 5_000,
        )
        core.setOutput(
            'integrationManifestUsed',
            rateLimit.resources.integration_manifest?.used ?? 0,
        )

        core.setOutput(
            'codeScanningUploadLimit',
            rateLimit.resources.code_scanning_upload?.limit ?? 500,
        )
        core.setOutput(
            'codeScanningUploadUsed',
            rateLimit.resources.code_scanning_upload?.used ?? 0,
        )

        core.setOutput(
            'actionsRunnerRegistrationLimit',
            rateLimit.resources.actions_runner_registration?.limit ?? 10_000,
        )
        core.setOutput(
            'actionsRunnerRegistrationUsed',
            rateLimit.resources.actions_runner_registration?.used ?? 0,
        )

        core.setOutput(
            'scimLimit',
            rateLimit.resources.scim?.limit ?? 15_000,
        )
        core.setOutput(
            'scimUsed',
            rateLimit.resources.scim?.used ?? 0,
        )

        core.setOutput(
            'dependencySnapshotsLimit',
            rateLimit.resources.dependency_snapshots?.limit ?? 100,
        )
        core.setOutput(
            'dependencySnapshotsUsed',
            rateLimit.resources.dependency_snapshots?.used ?? 0,
        )

    } catch (error) {
        core.setFailed(error instanceof Error ? error : `${error}`)
        throw error
    }
}

//noinspection JSIgnoredPromiseFromCall
run()
