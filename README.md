# Project Card Action

A [GitHub Action](https://help.github.com/en/actions) that moves *issue* cards in your [project boards](https://docs.github.com/en/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards), without having to specify the board and column names, from a workflow. **This project is in BETA. Please report bugs if encountered.**

## Usage

```yml
name: Move card

on:
  # refer https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#issues
  issues:
    types: [assigned]
  # refer https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#issue_comment
  issue_comment:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: ineshbose/project-card-action@v1
        with:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ISSUE_NUMBER: ${{ github.event.issue.number }}
          TARGET_COLUMN: 'Review'
```

<table>
<thead>
  <tr>
    <th>Argument</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>GH_TOKEN</td>
    <td>Yes</td>
    <td></td>
    <td>GitHub Token required to make changes. You can use ${{ secrets.GITHUB_TOKEN }}.</td>
  </tr>
  <tr>
    <td>ISSUE_NUMBER</td>
    <td>Yes</td>
    <td></td>
    <td>The issue number that the card is connected to.</td>
  </tr>
  <tr>
    <td>PROJECT_NAME</td>
    <td>No</td>
    <td></td>
    <td>The project/board where the card <i>should</i> be. The action searches through all projects/boards otherwise.</td>
  </tr>
  <tr>
    <td>SOURCE_COLUMN</td>
    <td>No</td>
    <td></td>
    <td>The column where the card <i>should</i> be. The action searches through all columns otherwise.</td>
  </tr>
  <tr>
    <td>TARGET_COLUMN</td>
    <td>Yes</td>
    <td></td>
    <td>The column where the card should be moved.</td>
  </tr>
  <tr>
    <td>CARD_POSITION</td>
    <td>No</td>
    <td>bottom</td>
    <td>The position of the card in the target column.</td>
  </tr>
</tbody>
</table>
