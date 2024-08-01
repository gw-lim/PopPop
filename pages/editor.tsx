import { useRouter } from 'next/router';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import 'react-quill/dist/quill.snow.css';
import { postEditorImage, postMagazine } from 'apis/api';

const EditorPage = () => {
  const quillRef = useRef<any>(null);
  const router = useRouter();

  const [value, setValue] = useState({
    title: '',
    writer: '',
    category: '',
  });
  const [editorValue, setEditorValue] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setValue((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const [isClient, setIsClient] = useState(false);

  // CSR에서만 ReactQuill을 불러옴
  useEffect(() => {
    setIsClient(true);
  }, []);

  const ReactQuill = isClient ? require('react-quill') : () => false;

  // 작성하기
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.title || !value.writer || !value.category || !editorValue) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    const res = await postMagazine({
      title: value.title,
      writer: value.writer,
      date: new Date().toISOString(),
      cate: value.category,
      contentHTML: editorValue,
    });

    if (res === 200) router.push('/magazine');
  };

  // 비밀번호
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('잘못된 비밀번호입니다.');
    }
  };

  // 이미지 업로드
  const handleImageUpload = async (file: File) => {
    const response = await postEditorImage(file);
    return response;
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.addEventListener('change', async () => {
      if (input.files === null) return;
      const file = input.files?.[0];
      const imageUrl = await handleImageUpload(file as File); // BASE64에서 이미지 URL로 변경

      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(); // 커서 위치 반환
      editor.insertEmbed(range.index, 'image', imageUrl); // 이미지 삽입
    });
  };

  // 리액트 퀼 설정 (모듈, 포맷)]
  // useMemo를 사용하지 않으면, 이미지 삽입할 때마다 modules가 리렌더링 되고, 리렌더링된 뒤에 커서 위치를 찾지 못해서 에러가 발생
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'link', 'image'],

          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

          [{ color: [] }, { background: [] }],
          [{ align: [] }],

          ['clean'],
        ],
        handlers: {
          image: imageHandler, // 이미지 핸들러 추가
        },
      },
    }),
    [],
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <div className='mx-auto my-40 flex min-h-[60dvh] max-w-1000 flex-col items-center gap-20'>
      {/* 비밀번호 입력 전 */}
      {!isAuthenticated && (
        <div className='mx-auto my-40 flex min-h-[60dvh] max-w-1000 items-center gap-20'>
          <form
            onSubmit={handlePasswordSubmit}
            className='flex items-center gap-20'
          >
            <input
              type='password'
              value={password}
              onChange={handlePasswordChange}
              placeholder='Enter password'
              className='h-80 w-full border-gray-200 text-[36px] font-700 placeholder:opacity-20 focus:border-gray-300 focus:outline-none'
            />
            <button
              type='submit'
              className='h-full whitespace-nowrap rounded-10 bg-black px-16 py-12 text-14 font-600 text-white'
            >
              Submit
            </button>
          </form>
        </div>
      )}
      {/* 비밀번호 입력 후 */}
      {isAuthenticated && (
        <>
          <div className='flex w-full items-center justify-between'>
            <input
              name='title'
              value={value.title}
              onChange={handleChange}
              placeholder='제목을 입력해주세요'
              spellCheck={false}
              className='h-80 w-full border-gray-200 text-[36px] font-700 placeholder:opacity-20 focus:border-gray-300 focus:outline-none'
            />
            <button
              onClick={handleSubmit}
              className='h-full whitespace-nowrap rounded-10 bg-black px-16 py-12 text-14 font-600 text-white'
            >
              작성하기
            </button>
          </div>
          <div className='flex w-full items-center justify-between gap-24'>
            <input
              name='writer'
              value={value.writer}
              onChange={handleChange}
              placeholder='작성자를 입력해주세요'
              spellCheck={false}
              className='h-32 w-1/2 rounded-12 text-[20px] font-500  placeholder:opacity-20 focus:border-gray-300 focus:outline-none'
            />
            <select
              name='category'
              value={value.category}
              onChange={handleChange}
              className='rounded-12 border-r-8 border-transparent bg-[#f5f5f5] py-12 pl-12 pr-24 font-500 focus:outline-none'
            >
              <option>카테고리를 선택해주세요</option>
              <option>팝업 매거진</option>
              <option>공간 매거진</option>
              <option>인물 매거진</option>
            </select>
          </div>
          {isClient ? (
            <div className='min-w-1000 max-w-1232 pt-40'>
              <ReactQuill
                ref={quillRef}
                name='editor'
                theme='snow'
                formats={formats}
                modules={modules}
                value={editorValue}
                onChange={setEditorValue}
                placeholder='글을 작성해 주세요.'
                imageHandler={imageHandler}
              />
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </>
      )}
    </div>
  );
};
export default EditorPage;
