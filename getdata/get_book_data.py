import requests
import pandas as pd
import re

def clean_text(text):
    """SQL 문 내 따옴표 오류 방지를 위한 클리닝"""
    if not text: return ""
    return text.replace("'", "''")

def get_aladin_to_sql(ttbkey, category_id, course_code, level_code):
    url = "http://www.aladin.co.kr/ttb/api/ItemList.aspx"
    params = {
        'ttbkey': ttbkey,
        'QueryType': 'Bestseller',
        'MaxResults': 10,  # 샘플로 10개씩 수집
        'start': 1,
        'SearchTarget': 'Foreign',
        'CategoryId': category_id,
        'output': 'js',
        'Version': '20131101'
    }

    try:
        response = requests.get(url, params=params)
        items = response.json().get('item', [])
    except:
        return [], ""

    books_data = []
    sql_statements = []

    for idx, item in enumerate(items):
        title = clean_text(item.get('title'))
        author = clean_text(item.get('author'))
        isbn = item.get('isbn13')
        
        # API에 없는 정보는 기본값 처리 (추후 직접 수정 가능)
        ar_level = 0.0  # 알라딘 API는 AR 지수를 제공하지 않음
        mom_tip = clean_text(item.get('description')[:50] + "...") if item.get('description') else "아이와 함께 읽기 좋은 책입니다."
        
        # 제목에서 키워드 대략 추출 (쉼표로 구분된 배열 형태)
        words = re.sub(r'[^a-zA-Z]', ' ', title).lower().split()
        key_words = f"ARRAY{list(set(words[:3]))}" if words else "ARRAY['book']"
        
        # 시리즈 정보 (제목에 괄호가 있는 경우 추출 시도)
        series_match = re.search(r'\((.*?)\)', title)
        series_name = f"'{series_match.group(1)}'" if series_match else "NULL"
        
        # 1. books 테이블 삽입 문구 (isbn 컬럼이 포함되어야 ON CONFLICT 작동)
        sql_books = f"INSERT INTO books (title, author, ar_level, mom_tip, key_words, series_name, isbn) " \
                    f"VALUES ('{title}', '{author}', {ar_level}, '{mom_tip}', {key_words}, {series_name}, '{isbn}') " \
                    f"ON CONFLICT (isbn) DO NOTHING;\n"
        
        # 2. course_books 테이블 삽입 문구 (가정: courses와 levels 테이블에 해당 코드가 이미 있음)
        sql_course = f"INSERT INTO course_books (course_id, book_id, level_id, sequence_order) " \
                     f"SELECT c.id, b.id, l.id, {idx+1} FROM courses c, books b, levels l " \
                     f"WHERE c.code = '{course_code}' AND b.isbn = '{isbn}' AND l.code = '{level_code}' " \
                     f"ON CONFLICT DO NOTHING;\n"
        
        sql_statements.append(sql_books + sql_course)
        
        books_data.append({
            'title': title, 'author': author, 'isbn': isbn, 
            'ar_level': ar_level, 'course': course_code, 'level': level_code
        })

    return books_data, "".join(sql_statements)

# --- 실행부 ---
TTB_KEY = "ttbjabbaek2038001"

# 카테고리별 매핑 설정 (카테고리ID, 코스코드, 레벨코드)
categories = [
    (11068, 'YELLOW_BASIC', 'AGE_0'),  # 어린이 -> 영유아
    (50921, 'PURPLE_CHAPTER', 'GRADE_6') # 청소년 -> 초등고학년
]

total_data = []
total_sql = "-- 알라딘 API 생성 데이터\n\n"

for cat_id, c_code, l_code in categories:
    data, sql = get_aladin_to_sql(TTB_KEY, cat_id, c_code, l_code)
    total_data.extend(data)
    total_sql += sql + "\n"

# 1. SQL 파일 저장
with open("aladin_insert_data.sql", "w", encoding="utf-8") as f:
    f.write(total_sql)

# 2. 엑셀 파일 저장
df = pd.DataFrame(total_data)
df.to_excel("aladin_books.xlsx", index=False)

print("작업 완료: 'aladin_insert_data.sql' 및 'aladin_books.xlsx' 파일이 생성되었습니다.")