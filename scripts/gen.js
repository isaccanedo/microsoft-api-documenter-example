const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')
// const execa = require('execa')
// const { gzipSync } = require('zlib')
// const { compress } = require('brotli')
// const { getTargets, fuzzyMatchTarget } = require('./utils')
const args = require('minimist')(process.argv.slice(2))
// const targets = args._
// const watch = args.watch || args.w
// const formats = args.formats || args.f || (watch && 'global')
// const devOnly = watch || args.devOnly || args.d
// const prodOnly = !devOnly && (args.prodOnly || args.p)
// const sourceMap = args.sourcemap || args.s || watch
const isRelease = args.release

// const buildTypes = args.t || args.types || isRelease
// const buildAllMatching = args.all || args.a

// const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)
const cwd = process.cwd()
const isSelfPackage_ = cwd.match(/packages[\\, /](\D+)$/)
const isSelfPackage = isSelfPackage_ && isSelfPackage_[0]

// build types
// https://github.com/nextgis/nextgis_frontend/blob/51bd939cf50df9657bbe5ed37327d641457eb417/packages/build-tools/lib/build.js
// "@microsoft/api-extractor": "^7.18.19",
async function doIt(target) {
  const rootPath = path.resolve(__dirname, '..')
  let pkgPath = `packages/${target}`
  if (isSelfPackage) {
    pkgPath = `../../${target}`
  }
  const pkgDir = path.resolve(pkgPath)
  const pkgFullPath = `${pkgDir}/package.json`
  const pkg = require(pkgFullPath)

  // only build published packages for release
  if (isRelease && pkg.private) {
    return
  }
  const reportFolder = path.resolve(rootPath, 'input')
  const reportTempFolder = path.resolve(rootPath, 'temp')

  const publicTrimmedFilePath = path.resolve(`${pkgPath}/lib/index.d.ts`)

  const mainEntryPointFilePath = path.resolve(
    pkgPath,
    'lib',
    isSelfPackage ? '' : 'packages',
    target,
    'src',
    'index.d.ts'
  )

  const extractorConfig = ExtractorConfig.prepare({
    packageJson: pkg,
    packageJsonFullPath: pkgFullPath,
    configObjectFullPath: pkgDir,
    configObject: {
      projectFolder: pkgDir,
      mainEntryPointFilePath,
      compiler: {
        tsconfigFilePath: path.resolve(`${rootPath}/tsconfig.json`),
        overrideTsconfig: {
          include: [path.resolve(pkgPath, 'src')],
        },
      },
      docModel: {
        enabled: true,
        apiJsonFilePath: `${reportFolder}/<unscopedPackageName>.api.json`,
      },
      tsdocMetadata: {
        enabled: false,
      },
      dtsRollup: {
        enabled: true,
        publicTrimmedFilePath,
      },
      apiReport: {
        enabled: true,
        reportFolder,
        reportTempFolder,
        reportFileName: '<unscopedPackageName>.api.md',
      },
      messages: {
        compilerMessageReporting: {
          default: {
            logLevel: 'warning',
          },
        },

        extractorMessageReporting: {
          default: {
            logLevel: 'warning',
            addToApiReportFile: true,
          },

          'ae-missing-release-tag': {
            logLevel: 'none',
          },
        },

        tsdocMessageReporting: {
          default: {
            logLevel: 'warning',
          },
          'tsdoc-undefined-tag': {
            logLevel: 'none',
          },
          'tsdoc-unsupported-tag': {
            logLevel: 'none',
          },
        },
      },
    },
  })
  try {
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true,
    })

    if (extractorResult.succeeded) {
      // concat additional d.ts to rolled-up dts
      const typesDir = path.resolve(pkgDir, 'types')
      if (await fs.exists(typesDir)) {
        const dtsPath = path.resolve(pkgDir, pkg.types)
        const existing = await fs.readFile(dtsPath, 'utf-8')
        const typeFiles = await fs.readdir(typesDir)
        const toAdd = await Promise.all(
          typeFiles.map((file) => {
            return fs.readFile(path.resolve(typesDir, file), 'utf-8')
          })
        )
        await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
      }
      console.log(
        chalk.bold(chalk.green(`API Extractor completed successfully.`))
      )
    } else {
      console.error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`
      )
      process.exitCode = 1
    }
  } catch (er) {
    console.log(chalk(er))
  }
}
