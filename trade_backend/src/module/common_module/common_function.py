import re


def AtasTranslateProcess(Name:str):
    code = Name

    match = re.search(
            r'#?([A-Z]{1,3})(?=[FGHJKMNQUVXZ]\d|$)',
            code
        )

    if not match:
        raise ValueError(f"非法代码: {code}")

    return match.group(1)

def OpenbbSymbolTranslateProcess(Name:str):
   return Name.split("=")[0]