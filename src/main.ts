import * as core from '@actions/core'
import {components} from '@octokit/openapi-types'
import {newOctokitInstance} from './internal/octokit'

type RateLimitOverview = components["schemas"]["rate-limit-overview"]
type RateLimitResource = keyof RateLimitOverview['resources']

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const githubToken = core.getInput('githubToken', {required: true})
core.setSecret(githubToken)
const octokit = newOctokitInstance(githubToken)

const defaultLimits: Record<RateLimitResource, number | null> = {
    'core': 5_000,
    'graphql': 5_000,
    'search': 30,
    'code_search': 10,
    'integration_manifest': 5_000,
    'code_scanning_upload': 500,
    'actions_runner_registration': 10_000,
    'scim': 15_000,
    'dependency_snapshots': 100,
    'source_import': null,
}

async function run(): Promise<void> {
    try {
        const rateLimit: RateLimitOverview = await octokit.rateLimit.get({})
            .then(it => it.data)
        core.info("Rate limits: " + JSON.stringify(rateLimit, null, 2))

        for (const resource in defaultLimits) {
            const defaultLimit = defaultLimits[resource]
            if (defaultLimit == null) {
                continue
            }

            const limit = rateLimit.resources[resource]?.limit ?? defaultLimit
            const used = rateLimit.resources[resource]?.used ?? 0
            const usage = 100 * Math.floor(used / limit)

            const outputName = resource.replaceAll(/_([a-z])/g, match => match[1].toUpperCase())
            core.info(outputName)
            core.setOutput(`${outputName}Usage`, usage)
            core.setOutput(`${outputName}Limit`, limit)
            core.setOutput(`${outputName}Used`, used)
        }


    } catch (error) {
        core.setFailed(error instanceof Error ? error : `${error}`)
        throw error
    }
}

//noinspection JSIgnoredPromiseFromCall
run()
