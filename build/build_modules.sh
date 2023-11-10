export modules_path='g:/.temp/CATSdesigner/modules'	
export admin_path=$modules_path'/admin'
export tests_path=$modules_path'/tests'
export subjects_path=$modules_path'/subjects'
export cp_path=$modules_path'/course-projects'
export dp_path=$modules_path'/diplom-projects'
export confirmation_path=$modules_path'/confirmation'
export editor_path=$modules_path'/editor'
export complex_path=$modules_path'/complex'
export schedule_path=$modules_path'/schedule'
export statistics_path=$modules_path'/statistics'

cd /d $admin_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $tests_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $subjects_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $cp_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $dp_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $confirmation_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $complex_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $editor_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $schedule_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build

cd $statistics_path
npx rimraf ./node_modules
npx rimraf ./package-lock.json
npm i
npm run build