from utils.file_io import read_json_list
from utils.json_exporter import export_company_json
from utils.pdf_generator import create_pdf
import os

# 导出 JSON 文件（每个公司单独一个）
def export_json_data(email: str):
    # 读取所有项目与岗位数据
    projects = read_json_list("data/projects.json")
    roles = read_json_list("data/roles.json")

    # 筛选当前公司拥有的数据
    owned_projects = [p for p in projects if p.get("owner") == email]
    owned_roles = [r for r in roles if r.get("owner") == email]

    # 组合导出结构
    data = {
        "company": email,
        "projects": owned_projects,
        "roles": owned_roles
    }

    # 写入 JSON 文件
    return export_company_json(email, data)


# 导出 PDF 文件（包含项目详细信息）
def export_pdf_data(email: str):
    projects = read_json_list("data/projects.json")
    owned = [p for p in projects if p.get("owner") == email]

    if not owned:
        return f"No projects found for {email}"

    # 构造文本内容
    lines = []
    for p in owned:
        lines.append(f"Project: {p.get('title', 'N/A')}")
        lines.append(f"Description: {p.get('description', 'N/A')}")
        lines.append(f"Timeline: {p.get('start_date', 'N/A')} - {p.get('end_date', 'N/A')}")
        lines.append(f"Budget: ${p.get('budget', 'N/A')}")
        lines.append(f"Position: {p.get('position', 'N/A')}")
        lines.append(f"Required Skills: {', '.join(p.get('skills_required', [])) or 'N/A'}")
        lines.append(f"Salary Range: {p.get('salary_range', 'N/A')}")
        lines.append("-" * 80)  # 分隔线

    # 输出路径
    filename = email.replace("@", "_at_").replace(".", "_")
    path = f"data/export/{filename}.pdf"

    # 生成 PDF 文件
    return create_pdf(path, f"Project Briefs for {email}", lines)
