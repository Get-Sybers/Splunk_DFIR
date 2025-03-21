import json
import re
from email import parser

import cexc


logger = cexc.get_logger(__name__)


def _split_on_find(content, bound):
    point = content.find(bound)
    return content[:point], content[point + len(bound) :]


def process_formdata_request(in_string, encoding='ISO-8859-1'):
    in_string = in_string.decode(encoding)
    request = json.loads(in_string)
    try:
        form_data = request['payload'].encode(encoding)
    except Exception as e:
        message = f"Encoding error found in request payload : {e}"
        logger.debug(message)
    request['payload'] = dict()

    try:  # look for boundary in header before attempting to construct from payload
        boundary_index = next(
            i for i, list in enumerate(request["headers"]) if "boundary" in list[1]
        )
        boundary = b'--' + str(request["headers"][boundary_index][1]).rsplit('=')[1].encode()
        raise StopIteration
    except (
        StopIteration
    ):  # could not find boundary in header, attempt to construct from payload
        # logger for no boundary found in header?
        boundary = form_data[: form_data.index(b'\r\n')]
    except:
        raise Exception("")  # idk throw exception or something

    form_data = form_data[:-4]  # chop off trailing '--\\r\\n"'
    form_data = form_data.replace(boundary, b'', 1)
    parts = form_data.split((b'\r\n' + boundary))

    for part in parts:
        if b'\r\n\r\n' in part:
            payload = dict()
            part = part.replace(b'\r\n', b'', 1)  # replace leading b'\r\n'
            part_split = part.split(b'\r\n\r\n', 1)  # split header and content
            header_bstr = part_split[0]
            payload["content"] = part_split[1]  # writes content to payload

            if header_bstr != b'':
                header_str = header_bstr.decode('ISO-8859-1')
                headers = header_str.split('\r\n')  # splits multiple headers
                payload["headers"] = []
                for header in headers:  # writes all headers to payload
                    header_tup = parser.HeaderParser().parsestr(header).items()[0]
                    payload["headers"].append(header_tup)

                name = re.search('name="(.*?)"', header_str).group(1)

            request["payload"][name] = payload

    return request
