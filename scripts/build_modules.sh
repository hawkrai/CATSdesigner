export base_path='..'
export server_path='server'
export container_path='container'
export modules_path='modules'
export admin_path=$modules_path'/admin'
export complex_path=$modules_path'/complex'
export confirmation_path=$modules_path'/confirmation'
export cp_path=$modules_path'/course-projects'
export dp_path=$modules_path'/diplom-projects'
export editor_path=$modules_path'/editor'
export schedule_path=$modules_path'/schedule'
export statistics_path=$modules_path'/statistics'
export subjects_path=$modules_path'/subjects'
export tests_path=$modules_path'/tests'

npx rimraf ./.temp
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force

cd $server_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
cd $base_path

cd $container_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path

cd $admin_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $complex_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $confirmation_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $cp_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $dp_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $editor_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $schedule_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $statistics_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $subjects_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path

cd $tests_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm_config_ignore_scripts=true pnpm i --force
pnpm run build --configuration=stage
cd $base_path
cd $base_path
