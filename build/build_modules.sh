export modules_path='/c/Work/CATSdesigner/modules'
export admin_path=$modules_path/'admin'
export tests_path=$modules_path'/tests'
export subjects_path=$modules_path'/subjects'
export cp_path=$modules_path'/course-projects'
export dp_path=$modules_path'/diplom-projects'
export confirmation_path=$modules_path'/confirmation'
export editor_path=$modules_path'/editor'
export complex_path=$modules_path'/complex'
export schedule_path=$modules_path'/schedule'
export statistics_path=$modules_path'/statistics'

cd $admin_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $tests_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $subjects_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $cp_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $dp_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $confirmation_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $complex_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $editor_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $schedule_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa

cd $statistics_path
npx rimraf ./node_modules
npm rimraf ./package-lock.json
npm i
npm run build:qa