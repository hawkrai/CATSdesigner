export modules_path='/d/.temp/CATSdesigner/modules/'
export admin_path=$modules_path'admin'
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
npm i
npm run build:qa

cd $tests_path
npm i
npm run build:qa

cd $subjects_path
npm i
npm run build:qa

cd $cp_path
npm i
npm run build:qa

cd $dp_path
npm i
npm run build:qa

cd $confirmation_path
npm i
npm run build:qa

cd $complex_path
npm i
npm run build:qa

cd $editor_path
npm i
npm run build:qa

cd $schedule_path
npm i
npm run build:qa

cd $statistics_path
npm i
npm run build:qa