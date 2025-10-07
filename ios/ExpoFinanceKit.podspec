require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoFinanceKit'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = { :ios => '17.4' }
  s.ios.deployment_target = '17.4'
  s.source         = { :git => 'https://github.com/kickstartcrew/expo-financekit.git', :tag => "#{s.version}" }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'React-Core'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_VERSION' => '5.0',
    'IPHONEOS_DEPLOYMENT_TARGET' => '17.4'
  }

  s.source_files = "**/*.{h,m,swift}"
  s.frameworks = 'FinanceKit'
  s.swift_version = '5.0'
end
