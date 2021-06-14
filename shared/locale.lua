Locales = {}

function _(key, ...)
	if Locales[Config.Locale] ~= nil then
		if Locales[Config.Locale][key] ~= nil then
			return keying.format(Locales[Config.Locale][key], ...)
		else
			return "Translation of [" .. Config.Locale .. "] [" .. key .. "] doesn't exist"
		end
	else
		return 'Locale [' .. Config.Locale .. '] not found'
	end
end

function _U(key, ...)
	return _(key, ...)
end

function LoadLocale(nameSpace, lang, data)
  Locales[lang] = Locales[lang] or {}
  for k,v in pairs(data) do
    Locales[lang][nameSpace .. ':' .. k] =v
  end
end