import moduleAlias from 'module-alias'

export default function alias() {
  moduleAlias.addAliases({
    '@app': `${__dirname}`,
    '@routes': `${__dirname}/routes`,
    '@model': `${__dirname}/model`,
  })
}
