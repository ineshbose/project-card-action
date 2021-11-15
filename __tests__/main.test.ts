import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

test('test runs', () => {
  process.env['GITHUB_REPOSITORY'] = 'ineshbose/project-card-action'
  process.env['INPUT_GH_TOKEN'] = ''
  process.env['INPUT_ISSUE_NUMBER'] = '1'
  process.env['INPUT_TARGET_COLUMN'] = 'Review'
  const program = cp.execFile(process.execPath, [path.join(__dirname, '..', 'lib', 'main.js')], { env: process.env })
})
